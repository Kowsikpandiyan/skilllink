const skillDatabase = [
  // Programming Languages
  "JavaScript", "Python", "Java", "C++", "C#", "PHP", "Ruby", "Go", "TypeScript",
  
  // Frontend
  "React", "Angular", "Vue", "HTML", "CSS", "Bootstrap", "jQuery", "Redux", "Next.js",
  
  // Backend  
  "Node.js", "Express", "Django", "Flask", "Spring", "Laravel",
  
  // Databases
  "MongoDB", "MySQL", "PostgreSQL", "SQL", "Redis", "Firebase",
  
  // Tools & Others
  "Git", "GitHub", "Docker", "AWS", "REST API", "GraphQL"
];

export default function extractSkills(text) {
  if (!text) return [];
  
  const foundSkills = [];
  const lowerText = text.toLowerCase();
  
  skillDatabase.forEach(skill => {
    if (lowerText.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  });
  
  return [...new Set(foundSkills)]; // Remove duplicates
}
