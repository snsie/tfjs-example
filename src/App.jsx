import { Suspense, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import DigitDraw from './components/digit-draw';
import ButtonAppBar from './components/app-bar';
import { ThemeProvider } from '@mui/material/styles';
import { StyledEngineProvider } from '@mui/material/styles';
import TaskTitle from './components/task-title/task-title';
import TaskPicker from './components/task-picker';
import theme from './components/theme';
import FaceTask from './components/face/face';
import { activities } from './store';
import WaitSpinner from './components/wait-spinner';

const App = () => {
  const [selectedIndex, setSelectedIndex] = useState(1);
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <ButtonAppBar taskCallback={setSelectedIndex} />
        <TaskTitle titleIndex={selectedIndex} />
        <Suspense fallback={<WaitSpinner />}>
          <TaskPicker selectedIndex={selectedIndex} />
        </Suspense>
      </div>
    </ThemeProvider>
  );
};

export default App;
