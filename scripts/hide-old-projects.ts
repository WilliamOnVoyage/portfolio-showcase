
import fs from 'fs/promises';
import path from 'path';

async function main() {
    const projectsPath = path.join(process.cwd(), 'src', 'data', 'projects.json');
    const overridesPath = path.join(process.cwd(), 'data', 'project-overrides.json');

    try {
        // Read Projects
        const projectsData = await fs.readFile(projectsPath, 'utf8');
        const projects = JSON.parse(projectsData);

        // Read Overrides
        let overrides: Record<string, any> = {};
        try {
            const overridesData = await fs.readFile(overridesPath, 'utf8');
            overrides = JSON.parse(overridesData);
        } catch (e) {
            console.log('No existing overrides, starting fresh.');
        }

        let hiddenCount = 0;
        const cutoffDate = new Date('2020-01-01T00:00:00Z');

        projects.forEach((p: any) => {
            const updateDate = new Date(p.updated_at);
            if (updateDate < cutoffDate) {
                if (!overrides[p.name]) {
                    overrides[p.name] = {};
                }
                // Only hide if not already explicitly showing/hiding (optional safety, but user said "mark all")
                // User said "mark all projects last updated before 2020 as hidden"
                overrides[p.name].hidden = true;
                hiddenCount++;
            }
        });

        // Write Overrides
        await fs.writeFile(overridesPath, JSON.stringify(overrides, null, 2));
        console.log(`Updated overrides. Marked ${hiddenCount} projects as hidden.`);

    } catch (error) {
        console.error('Error:', error);
    }
}

main();
