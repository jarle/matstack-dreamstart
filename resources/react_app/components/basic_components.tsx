import React, { ChangeEvent, ReactNode } from 'react'

// Heading 1
interface H1Props {
  children: ReactNode
}

export const H1: React.FC<H1Props> = ({ children }) => (
  <h1 className="mb-4 text-4xl font-bold">{children}</h1>
)

// Heading 2
interface H2Props {
  children: ReactNode
}

export const H2: React.FC<H2Props> = ({ children }) => (
  <h2 className="mb-3 text-3xl font-semibold">{children}</h2>
)

// Heading 3
interface H3Props {
  children: ReactNode
}

export const H3: React.FC<H3Props> = ({ children }) => (
  <h3 className="mb-2 text-2xl font-medium">{children}</h3>
)

// Paragraph
interface PProps {
  children: ReactNode
}

export const P: React.FC<PProps> = ({ children }) => (
  <p className="mb-4 text-base leading-relaxed">{children}</p>
)

// Card
interface CardProps {
  children: ReactNode
}

export const Card: React.FC<CardProps> = ({ children }) => (
  <div className="p-6 rounded-lg shadow-md">{children}</div>
)

// List
interface ListProps {
  items: string[]
}

export const List: React.FC<ListProps> = ({ items }) => (
  <ul className="mb-4 list-disc list-inside">
    {items.map((item, index) => (
      <li key={index} className="mb-2">
        {item}
      </li>
    ))}
  </ul>
)

// Input
interface InputProps {
  type?: 'text' | 'password' | 'email' | 'number'
  placeholder: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

export const Input: React.FC<InputProps> = ({ type = 'text', placeholder, onChange }) => (
  <input
    type={type}
    placeholder={placeholder}
    onChange={onChange}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-gray-200"
  />
)

// Container
interface ContainerProps {
  children: ReactNode
}

export const Container: React.FC<ContainerProps> = ({ children }) => (
  <div className="max-w-4xl px-4 mx-auto">{children}</div>
)
