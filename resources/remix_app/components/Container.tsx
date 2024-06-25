interface MainContainerProps {
  children: React.ReactNode
  title?: React.ReactNode | string
  subtitle?: React.ReactNode | string
}

export function Container({ children, title, subtitle }: MainContainerProps) {
  return (
    <div className="w-full max-w-2xl mx-auto pt-8">
      {title && <h1 className="text-4xl font-extrabold">{title}</h1>}
      {subtitle && <h2 className="mb-8 text-xl">{subtitle}</h2>}
      {children}
    </div>
  )
}
