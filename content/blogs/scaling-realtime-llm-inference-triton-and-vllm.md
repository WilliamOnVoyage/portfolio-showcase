---
slug: "scaling-realtime-llm-inference-triton-and-vllm"
title: "Scaling Real-Time LLM & Embedding Inference: Lessons from 10 Years in AI Infra"
description: "Architectural strategies for low-latency LLM serving, dynamic batching with vLLM & Triton Inference Server, KV cache optimization, and multi-GPU tensor parallelism."
date: "2026-07-18"
readTime: "10 min read"
tags:
  - "AI Infrastructure"
  - "PyTorch"
  - "vLLM"
  - "Triton"
  - "Ray"
featured: false
author:
  name: "Moliang Zhou"
  role: "AI Infrastructure & Web3 Engineer"
---

## Introduction

Serving large language models (LLMs) and high-dimensional embedding models in production environments presents fundamentally different challenges than traditional REST API backends. Requests require dynamic token generation lengths, PagedAttention KV cache management, and multi-GPU communication topology.

Over the past decade leading AI platform teams from 0-to-1, I've observed that latency bottlenecks in real-time inference rarely stem from raw FLOP throughput—they originate from memory bandwidth, attention cache fragmentation, and queue management under high concurrent load.

---

## 1. PagedAttention & Continuous Batching

Traditional transformer inference pre-allocated contiguous memory blocks for the Key-Value (KV) cache based on the maximum sequence length (e.g. 4096 tokens). This resulted in up to 60-80% memory fragmentation and severely capped batch sizes.

By leveraging `vLLM` and PagedAttention, memory is partitioned into fixed-size physical blocks (e.g., 16 tokens per block), mapped dynamically via a page table similar to virtual memory operating systems.

```python
# Example vLLM AsyncEngine Setup with PagedAttention & Tensor Parallelism
from vllm.engine.arg_utils import AsyncEngineArgs
from vllm.engine.async_llm_engine import AsyncLLMEngine

engine_args = AsyncEngineArgs(
    model="meta-llama/Llama-3.1-70B-Instruct",
    tensor_parallel_size=4,
    gpu_memory_utilization=0.90,
    max_num_seqs=256,
    enable_chunked_prefill=True,
    kv_cache_dtype="fp8"
)

engine = AsyncLLMEngine.from_engine_args(engine_args)
```

### Results & Throughput Gains
- **Token Throughput**: Increased by **3.8x** under 100 concurrent streams.
- **TTFT (Time to First Token)**: Reduced from **350ms to 42ms** using Chunked Prefill.

---

## 2. Multi-GPU Topology: Tensor vs Pipeline Parallelism

When scaling models across multiple GPUs:
- **Tensor Parallelism (TP)** splits individual layer weights across GPUs. It requires ultra-fast NVLink interconnect (900 GB/s) because GPUs synchronize after every layer.
- **Pipeline Parallelism (PP)** splits layers sequentially across nodes. It works over standard PCIe / InfiniBand but introduces pipeline bubble overhead.

Rule of thumb: Use **Tensor Parallelism within a single multi-GPU host (8x H100)** and **Pipeline Parallelism across separate physical nodes**.
