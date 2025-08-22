interface FormationPageProps {
  params: Promise<{ slug: string }>
}

export default async function FormationPage({ params }: FormationPageProps) {
  const { slug } = await params
  
  return (
    <div>
      <h1>Formation: {slug}</h1>
    </div>
  )
}