---
slug: "mintagent-3-stage-verification-cascade-and-solidity-escrow"
title: "MintAgent: Building a 3-Stage AI & Smart Contract Task Verification Cascade"
description: "How we combined GitHub CI pipelines, LLM-as-Judge semantic evaluation, 48-hour SLA auto-approvals, and Base Sepolia USDC smart contract escrows into a decentralized outcome marketplace."
date: "2026-07-25"
readTime: "8 min read"
tags:
  - "AI Infrastructure"
  - "Solidity"
  - "Web3"
  - "Next.js"
featured: true
author:
  name: "Moliang Zhou"
  role: "AI Infrastructure & Web3 Engineer"
---

## Background & System Motivation

In traditional freelancing and contract engineering, buyers pay for **time spent** rather than **verified outcomes**. This leads to misaligned incentives, manual oversight overhead, and friction in milestone releases. With the emergence of autonomous LLM developer agents (such as Claude Code, Cursor, and custom solver bots), we can automate not just solution generation, but solution **verification** and **escrow settlement**.

`MintAgent` was built to solve this problem by introducing a machine-verifiable task outcome marketplace powered by a 3-Stage Verification Cascade and an on-chain USDC escrow contract on Base Sepolia.

---

## The 3-Stage Verification Cascade

When a worker or autonomous solver bot submits proof of work for a task, the platform routes the submission through three progressive verification layers:

```
+-----------------------------------------------------------------------+
| SUBMISSION (Proof of Work & Artifacts)                                |
+-----------------------------------------------------------------------+
                                   │
                                   ▼
┌───────────────────────────────────────────────────────────────────────┐
│ STAGE 1: Automated Programmatic Verification                         │
│ • GitHub Actions CI pipeline trigger                                  │
│ • Strict JSON Schema & Unit Test Assertions                           │
└───────────────────────────────────────────────────────────────────────┘
                                   │ PASS
                                   ▼
┌───────────────────────────────────────────────────────────────────────┐
│ STAGE 2: AI-as-Judge Evaluation                                       │
│ • LLM semantic review against task criteria                           │
│ • Confidence scoring & evidence audit logging                         │
└───────────────────────────────────────────────────────────────────────┘
                                   │ HIGH CONFIDENCE
                                   ▼
┌───────────────────────────────────────────────────────────────────────┐
│ STAGE 3: Buyer Review & 48-Hour Auto-Approval Engine                  │
│ • 1-Click approval or evidence dispute                                │
│ • Automatic SLA approval trigger if buyer is inactive for 48 hrs      │
└───────────────────────────────────────────────────────────────────────┘
                                   │ APPROVED
                                   ▼
┌───────────────────────────────────────────────────────────────────────┐
│ ON-CHAIN SETTLEMENT                                                   │
│ • Solidity BountyEscrow.sol releases USDC to verifier/worker          │
└───────────────────────────────────────────────────────────────────────┘
```

### Stage 1: Programmatic CI Validation
The first gate ensures objective deterministic rules pass without wasting LLM inference budget. The task creator defines machine-verifiable criteria (e.g., passing pytest suites, OpenAPI spec compliance, or linter clean state). A GitHub webhook triggers the repository CI runner and reports back a signed verification payload.

### Stage 2: AI-as-Judge Evaluation
For criteria requiring soft evaluation (code quality, documentation completeness, UI responsiveness), Stage 2 invokes an LLM configured with structured JSON outputs. The judge evaluates:
- Artifact completeness against criteria
- System edge cases & code maintainability
- Assigns a numeric confidence score (0.00 - 1.00) and rationale trace

### Stage 3: SLA Engine & Dispute Mediation
To prevent funds from being trapped indefinitely if a buyer disappears, the system initiates a 48-hour SLA timer. If the submission passes Stages 1 & 2 and the buyer does not act within 48 hours, the background SLA engine automatically approves the submission and triggers on-chain payout.

---

## On-Chain Escrow Architecture (`BountyEscrow.sol`)

The escrow contract is written in Solidity using OpenZeppelin's `ReentrancyGuard` and `AccessControl`. It handles deposit locks, verifier attestations, dispute freezes, and emergency refunds.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract BountyEscrow is ReentrancyGuard {
    IERC20 public immutable usdcToken;
    address public verifier;

    struct TaskBounty {
        address buyer;
        uint256 amount;
        bool isFulfilled;
        bool isDisputed;
    }

    mapping(bytes32 => TaskBounty) public bounties;

    event TaskCreated(bytes32 indexed taskId, address buyer, uint256 amount);
    event BountyReleased(bytes32 indexed taskId, address recipient, uint256 amount);

    constructor(address _usdcToken, address _verifier) {
        usdcToken = IERC20(_usdcToken);
        verifier = _verifier;
    }

    function releaseBounty(bytes32 taskId, address worker) external nonReentrant {
        require(msg.sender == verifier, "Only verifier can release");
        TaskBounty storage bounty = bounties[taskId];
        require(!bounty.isFulfilled, "Already fulfilled");
        require(!bounty.isDisputed, "Task under dispute");

        bounty.isFulfilled = true;
        require(usdcToken.transfer(worker, bounty.amount), "Transfer failed");

        emit BountyReleased(taskId, worker, bounty.amount);
    }
}
```

---

## Key Takeaways

1. **Shift to Verifiable Outcomes**: AI developer agents will transform how engineering bounties are published, verified, and paid out.
2. **Hybrid Verification is Mandatory**: Neither pure CI nor pure LLM judging is sufficient on its own. Combining deterministic CI with semantic LLM evaluation produces robust verification trust.
3. **Decentralized Escrow Guarantees Payouts**: Smart contract escrow ensures buyers cannot withhold funds for valid work, while auto-approval SLAs prevent worker deadlock.
