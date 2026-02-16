export function RichText({ content }: { content: string }) {
  const blocks = content.split('\n\n');

  return (
    <div className="prose prose-invert max-w-none prose-headings:font-display prose-headings:uppercase prose-p:text-zinc-200">
      {blocks.map((block, index) => {
        if (block.startsWith('# ')) {
          return <h1 key={index}>{block.replace('# ', '')}</h1>;
        }
        if (block.startsWith('## ')) {
          return <h2 key={index}>{block.replace('## ', '')}</h2>;
        }
        return <p key={index}>{block}</p>;
      })}
    </div>
  );
}
