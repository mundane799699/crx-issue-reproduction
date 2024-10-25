export function Image(props: { src: string; alt?: string; url?: string }) {
  return (
    <figure className="h-auto w-full" title={props.alt || ""}>
      <a href={props.url || props.src} target="_blank">
        <img
          className="min-h-8 rounded-lg max-h-[520px]"
          src={props.src}
          loading="lazy"
        />
      </a>
    </figure>
  );
}
