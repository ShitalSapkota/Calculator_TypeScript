import { useState } from 'react';
import { Container, Paper, Grid, TextField, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  root: {
    padding: '2rem',
    marginTop: '2rem',
  },
  display: {
    marginBottom: '1rem',
    textAlign: 'right',
    fontSize: '1.5rem',
  },
  button: {
    height: '4rem',
    fontSize: '1.2rem',
  },
});

const Calculator: React.FC = () => {
  const classes = useStyles();
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [isNewNumber, setIsNewNumber] = useState(true);

  const handleNumber = (num: string) => {
    if (isNewNumber) {
      setDisplay(num);
      setExpression(prev => prev + (prev === '' ? num : ` ${num}`));
      setIsNewNumber(false);
    } else {
      setDisplay(display + num);
      setExpression(prev => {
        // Remove trailing space before appending number
        const parts = prev.split(' ');
        parts[parts.length - 1] += num;
        return parts.join(' ');
      });
    }
  };

  const handleOperator = (op: string) => {
    if (operator === null) {
      setPreviousValue(parseFloat(display));
      setExpression(prev => `${prev} ${op} `);
    } else {
      const currentValue = parseFloat(display);
      const result = calculateResult(previousValue!, currentValue, operator);
      setPreviousValue(result);
      setExpression(`${result} ${op} `);
      setDisplay(result.toString());
    }
    setOperator(op);
    setIsNewNumber(true);
  };

  const calculateResult = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return a / b;
      default: return b;
    }
  };

  const calculate = () => {
    if (previousValue === null || operator === null) return;
    
    const currentValue = parseFloat(display);
    const result = calculateResult(previousValue, currentValue, operator);

    setDisplay(result.toString());
    setExpression(prev => `${prev}= ${result}`);
    setPreviousValue(null);
    setOperator(null);
    setIsNewNumber(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setExpression('');
    setPreviousValue(null);
    setOperator(null);
    setIsNewNumber(true);
  };

  const handleDecimal = () => {
    if (isNewNumber) {
      setDisplay('0.');
      setExpression(prev => prev === '' ? '0.' : `${prev} 0.`);
      setIsNewNumber(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
      setExpression(prev => {
        const parts = prev.split(' ');
        parts[parts.length - 1] += '.';
        return parts.join(' ');
      });
    }
  };

  return (
    <Container maxWidth="xs" className={classes.root}>
        <h1>Calculator App</h1>
      <Paper elevation={3}>
        <TextField
          className={classes.display}
          fullWidth
          variant="outlined"
          value={expression || '0'}
          inputProps={{ 
            readOnly: true,
            style: { fontSize: '1.5rem', textAlign: 'right' }
          }}
        />
        <Grid container spacing={1} sx={{ p: '0.5rem' }}>
            <Grid>
            <Button
                fullWidth
                variant="contained"
                color="secondary"
                className={classes.button}
                onClick={handleClear}
            >
                C
            </Button>
            </Grid>
        
        {/* Number Buttons */}
        {[1,2,3,4,5,6,7,8,9,0].map((num) => (
            <Grid key={num}>
                <Button
                fullWidth
                variant="outlined"
                className={classes.button}
                onClick={() => handleNumber(num.toString())}
                >
                {num}
                </Button>
            </Grid>
        ))}

        {/* Operators */}
        {['/', '*', '-', '+'].map((op) => (
            <Grid key={op}>
                <Button
                fullWidth
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={() => handleOperator(op)}
                >
                {op === '*' ? '×' : op === '/' ? '÷' : op}
                </Button>
            </Grid>
        ))}

        {/* Decimal and Equals */}
            <Grid>
            <Button
                fullWidth
                variant="outlined"
                className={classes.button}
                onClick={handleDecimal}
            >
                .
            </Button>
            </Grid>
            <Grid>
            <Button
                fullWidth
                variant="contained"
                color="secondary"
                className={classes.button}
                onClick={calculate}
            >
                =
            </Button>
            </Grid>
      </Grid>
      </Paper>
    </Container>
  );
};

export default Calculator;