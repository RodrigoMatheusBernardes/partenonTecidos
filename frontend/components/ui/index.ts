// Design System Components - Central Export

// Reexporta os componentes com export default
export { default as Button } from './Button';
export { default as ProductCard } from './ProductCard';

// Reexporta os componentes com named export (sem 'default as')
export { Input } from './Input';
export { Badge } from './Badge';
export { Select } from './Select';

// Reexporta os componentes do Card (já eram named exports)
export { Card, CardHeader, CardContent, CardFooter } from './Card';