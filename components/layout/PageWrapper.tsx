import { HTMLAttributes } from 'react'

interface PageWrapperProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
}

export default function PageWrapper({ title, children, className = '', ...props }: PageWrapperProps) {
  return (
    <div className={`flex-1 p-6 overflow-y-auto ${className}`} {...props}>
      {title && (
        <h2 className="font-serif text-2xl font-semibold text-[var(--color-text)] mb-6">
          {title}
        </h2>
      )}
      {children}
    </div>
  )
}
