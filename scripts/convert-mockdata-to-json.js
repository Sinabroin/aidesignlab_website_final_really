// Convert TypeScript mockData.ts to JSON for Python backend
const fs = require('fs');
const path = require('path');

const mockDataPath = path.join(__dirname, '..', 'apps', 'web', 'data', 'mockData.ts');
const outputPath = path.join(__dirname, '..', 'data', 'mock_data.json');

// Read and parse TypeScript file (simple extraction)
const content = fs.readFileSync(mockDataPath, 'utf-8');

// Extract playdayData
const playdayMatch = content.match(/export const playdayData: GalleryItem\[\] = \[([\s\S]*?)\];/);
const playbookUsecasesMatch = content.match(/export const playbookUsecases: GalleryItem\[\] = \[([\s\S]*?)\];/);
const playbookTrendsMatch = content.match(/export const playbookTrends: GalleryItem\[\] = \[([\s\S]*?)\];/);
const playbookPromptsMatch = content.match(/export const playbookPrompts: GalleryItem\[\] = \[([\s\S]*?)\];/);
const playbookHAIMatch = content.match(/export const playbookHAI: GalleryItem\[\] = \[([\s\S]*?)\];/);
const playbookTeamsMatch = content.match(/export const playbookTeams: GalleryItem\[\] = \[([\s\S]*?)\];/);
const noticesMatch = content.match(/export const notices = \[([\s\S]*?)\];/);

// Simple JSON extraction (this is a basic implementation)
// In production, use a proper TypeScript parser
function extractJSON(str) {
  try {
    // Remove comments and fix common issues
    const cleaned = str
      .replace(/\/\/.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/(\w+):/g, '"$1":')
      .replace(/'/g, '"');
    return JSON.parse(cleaned);
  } catch (e) {
    console.error('Failed to parse:', e);
    return [];
  }
}

const mockData = {
  playday: playdayMatch ? extractJSON(playdayMatch[1]) : [],
  playbook: {
    usecase: playbookUsecasesMatch ? extractJSON(playbookUsecasesMatch[1]) : [],
    trend: playbookTrendsMatch ? extractJSON(playbookTrendsMatch[1]) : [],
    prompt: playbookPromptsMatch ? extractJSON(playbookPromptsMatch[1]) : [],
    hai: playbookHAIMatch ? extractJSON(playbookHAIMatch[1]) : [],
    teams: playbookTeamsMatch ? extractJSON(playbookTeamsMatch[1]) : [],
  },
  notices: noticesMatch ? extractJSON(noticesMatch[1]) : [],
};

// Ensure output directory exists
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(mockData, null, 2), 'utf-8');
console.log(`✅ Converted mockData.ts to ${outputPath}`);
