import 'reflect-metadata';

import { createRoot } from 'react-dom/client';

import { App } from './demo';

const app = createRoot(document.getElementById('root')!);

app.render(<App />);
