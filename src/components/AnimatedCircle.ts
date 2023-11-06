import { styled, keyframes } from '@mui/system';

const glowRed = keyframes`
  0% {
    box-shadow: 0 0 5px #FF0000;
  }
  100% {
    box-shadow: 0 0 20px #FF0000, 0 0 30px #FF0000;
  }
`;

const glowYellow = keyframes`
  0% {
    box-shadow: 0 0 5px #FFFF00;
  }
  100% {
    box-shadow: 0 0 20px #FFFF00, 0 0 30px #FFFF00;
  }
`;

const glowGreen = keyframes`
  0% {
    box-shadow: 0 0 5px #00FF00;
  }
  100% {
    box-shadow: 0 0 20px #00FF00, 0 0 30px #00FF00;
  }
`;

export const AnimatedCircle = styled('div')({
  position: 'relative',
  margin: '16px',
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, red, yellow, green)',
  animation: `${glowRed} 1.5s infinite, ${glowYellow} 1.5s infinite 0.5s, ${glowGreen} 1.5s infinite 1s`,
});
