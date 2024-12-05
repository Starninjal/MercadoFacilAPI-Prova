import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Grid, Typography } from "@mui/material"; // Importando os componentes do Material UI
import { LoginData } from "../../Interfaces/LoginData";
import { LoginAPI } from "../../Servicos/MercadoFacilAPI";
import './Login.css';

const Login = () => {
    const [loginData, setLoginData] = useState<LoginData>({
        email: '',
        password: ''
    });
    const navigate = useNavigate(); // Hook para navegação

    const handleLogin = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setLoginData({
            ...loginData,
            [name]: value
        });
    };

    const handleSubmit = async (event: React.MouseEventHandler<HTMLButtonElement> | any) => {
        event.preventDefault();
        try {
            const response = await LoginAPI(loginData);
            if (response.data && response.status === 200) {
                alert('Login realizado com sucesso');
                sessionStorage.setItem('token', response.data.token);
                navigate('/dashboard'); // Redireciona para a página de dashboard após login
            } else {
                alert('Falha no login');
            }
        } catch (e: Error | any) {
            console.error('Falha no login: ' + e.message);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f4f4f9',
            }}
        >
            <Grid container spacing={2} sx={{ width: 350 }}>
                <Grid item xs={12}>
                    <Typography variant="h5" align="center" sx={{ marginBottom: 2 }}>
                        Mercado Fácil
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="E-mail"
                        variant="outlined"
                        name="email"
                        value={loginData.email}
                        onChange={handleLogin}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Senha"
                        variant="outlined"
                        type="password"
                        name="password"
                        value={loginData.password}
                        onChange={handleLogin}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        sx={{
                            padding: '12px',
                            fontSize: '16px',
                        }}
                    >
                        Entrar
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Login;
