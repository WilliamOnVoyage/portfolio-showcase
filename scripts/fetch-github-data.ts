
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import fs from 'fs/promises';
import path from 'path';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

async function fetchGithub(url: string) {
    if (!GITHUB_TOKEN) {
        throw new Error('GITHUB_TOKEN not found');
    }

    const response = await fetch(url, {
        headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            'User-Agent': 'portfolio-showcase-v1'
        }
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`GitHub API Error: ${response.status} ${response.statusText} - ${text}`);
    }

    return response.json();
}

async function fetchAllRepos() {
    let repos: any[] = [];
    let page = 1;
    const per_page = 100;

    while (true) {
        console.log(`Fetching page ${page}...`);
        const pageData = await fetchGithub(
            `https://api.github.com/user/repos?per_page=${per_page}&page=${page}&affiliation=owner,collaborator,organization_member&sort=updated&direction=desc`
        );

        if (pageData.length === 0) break;
        repos = repos.concat(pageData);

        if (pageData.length < per_page) break;
        page++;
    }
    return repos;
}

async function main() {
    console.log('Fetching repositories...');

    // 1. Load Overrides
    const overridesPath = path.join(process.cwd(), 'data', 'project-overrides.json');
    let overrides: Record<string, any> = {};
    try {
        const data = await fs.readFile(overridesPath, 'utf8');
        overrides = JSON.parse(data);
        console.log(`Loaded overrides for ${Object.keys(overrides).length} projects.`);
    } catch (error) {
        console.warn('No overrides file found or failed to parse.', error);
    }

    // 2. Fetch Repositories
    let repos: any[] = [];
    try {
        repos = await fetchAllRepos();
        console.log(`Fetched ${repos.length} repositories from GitHub.`);
    } catch (error) {
        console.error('Error fetching repositories:', error);
        process.exit(1);
    }

    // 3. Transform and Merge
    const projects = await Promise.all(repos.map(async (repo: any) => {
        const override = overrides[repo.name] || {};

        // Fetch PORTFOLIO.json if it exists (using API)
        let contract: any = {};
        try {
            const contentsUrl = `https://api.github.com/repos/${repo.full_name}/contents/PORTFOLIO.json`;
            const res = await fetch(contentsUrl, {
                headers: {
                    Authorization: `token ${GITHUB_TOKEN}`,
                    'User-Agent': 'portfolio-showcase-v1',
                    'Accept': 'application/vnd.github.v3.raw' // Get raw content
                }
            });
            if (res.ok) {
                contract = await res.json();
            }
        } catch (e) {
            // Ignore errors (file not found, etc)
        }

        const isPrivate = repo.private;
        const htmlUrl = isPrivate ? null : repo.html_url;

        // Date Filtering Logic
        const cutoffDate = new Date('2020-01-01T00:00:00Z');
        const updateDate = new Date(repo.updated_at);
        const isOld = updateDate < cutoffDate;

        // Hidden Logic:
        // 1. Explicit override takes precedence
        // 2. If no override, hide if old
        // 3. Otherwise show
        let isHidden = false;
        if (override.hidden !== undefined) {
            isHidden = override.hidden;
        } else if (isOld) {
            isHidden = true;
        }

        return {
            id: repo.name,
            name: repo.name,
            description: contract.tagline || override.description || repo.description,
            html_url: htmlUrl,
            homepage: repo.homepage,
            language: repo.language,
            stargazers_count: repo.stargazers_count,
            forks_count: repo.forks_count,
            updated_at: repo.updated_at,
            is_private: isPrivate,
            topics: repo.topics || [],

            techStack: override.techStack || (repo.language ? [repo.language] : []),
            category: override.category || 'Other',
            featured: override.featured || false,
            mockup: contract.thumbnail || override.mockup || null,
            longDescription: contract.publicDescription || override.longDescription || null,
            hidden: isHidden,

            tagline: contract.tagline || null,
            demoUrl: contract.demoUrl || null,
            liveUrl: contract.liveUrl || null,
            publicDescription: contract.publicDescription || null
        };
    }));

    const visibleProjects = projects.filter((p: any) => !p.hidden);

    // 4. Inject "Missing" Private Projects (that exist in overrides but not in fetched list)
    const fetchedRepoNames = new Set(repos.map((r: any) => r.name));
    const missingOverrides = Object.keys(overrides).filter(name => !fetchedRepoNames.has(name));

    if (missingOverrides.length > 0) {
        console.log(`Adding ${missingOverrides.length} manual entries from overrides (not found in API fetch)...`);
        missingOverrides.forEach(name => {
            const override = overrides[name];
            if (override.hidden) return;

            projects.push({
                id: name,
                name: name,
                description: override.description || 'Private Repository',
                html_url: null,
                homepage: null,
                language: null,
                stargazers_count: 0,
                forks_count: 0,
                updated_at: new Date().toISOString(), // No real date
                is_private: true,
                topics: [],
                techStack: override.techStack || [],
                category: override.category || 'Other',
                featured: override.featured || false,
                mockup: override.mockup || null,
                longDescription: override.longDescription || null,
                hidden: false,

                tagline: null,
                demoUrl: null,
                liveUrl: null,
                publicDescription: null
            });
        });
    }

    // 5. Save
    const outputPath = path.join(process.cwd(), 'src', 'data', 'projects.json');
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, JSON.stringify(projects, null, 2));
    console.log(`Saved ${projects.length} projects to ${outputPath}`);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
