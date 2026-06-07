type ContributionCardProps = {
  number: string;
  title: string;
  description: string;
  skills: string;
};

export function ContributionCard({
  number,
  title,
  description,
  skills,
}: ContributionCardProps) {
  return (
    <article className="contribution-card">
      <div className="contribution-number">{number}</div>
      <div>
        <p className="eyebrow">Open contribution</p>
        <h3>{title}</h3>
        <p>{description}</p>
        <span>{skills}</span>
      </div>
    </article>
  );
}
