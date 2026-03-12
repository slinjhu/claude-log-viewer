export function TextBlock({ text }: { text: string }) {
  return (
    <div className="text-sm whitespace-pre-wrap leading-relaxed">
      {text}
    </div>
  );
}
