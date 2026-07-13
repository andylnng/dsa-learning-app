// Charge tous les fichiers markdown de src/content en texte brut.
const modules = import.meta.glob('../content/*.md', { query: '?raw', import: 'default', eager: true }) as Record<
  string,
  string
>

export function getLessonContent(name: string): string | undefined {
  return modules[`../content/${name}.md`]
}
