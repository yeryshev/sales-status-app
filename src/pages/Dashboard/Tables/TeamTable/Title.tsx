import * as React from 'react'
import Typography from '@mui/material/Typography'
import { memo } from 'react';

interface TitleProps {
  children?: React.ReactNode
}

const Title = memo((props: TitleProps) => {
    return (
        <Typography component="h2" variant="h6" color="primary" mb={2}>
            {props.children}
        </Typography>
    )
})

export default Title
