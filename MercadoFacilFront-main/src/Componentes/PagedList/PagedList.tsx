import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Box, Modal, IconButton, Fade, Drawer, FormControlLabel, Checkbox, TextField, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import MenuIcon from '@mui/icons-material/Menu';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonIcon from '@mui/icons-material/Person';
import { FetchShareListPaged } from "../../Servicos/MercadoFacilAPI";
import { ShareCardProps } from '../../Interfaces/ShareCardProps';
import { useNavigate } from 'react-router-dom';

const PagedList: React.FC = () => {
    const navigate = useNavigate();
    const [shares, setShares] = useState<ShareCardProps[]>([]);
    const [favorites, setFavorites] = useState<ShareCardProps[]>([]);
    const [page, setPage] = useState(1);
    const [resultsPerPage, setResultsPerPage] = useState(17);
    const [open, setOpen] = useState(false);
    const [selectedShare, setSelectedShare] = useState<ShareCardProps | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            fetchShares();
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const fetchShares = async () => {
        try {
            let response = await FetchShareListPaged(page, resultsPerPage);
            if (response && response.items) {
                let fetchedShares = response.items;
                if (showFavoritesOnly) {
                    const favoriteShares = fetchedShares.filter((share: ShareCardProps) =>
                        favorites.some(favorite => favorite.symbol === share.symbol)
                    );
                    setShares(favoriteShares);
                } else {
                    setShares(fetchedShares);
                }
            }
        } catch (error) {
            console.error("Erro ao buscar ações:", error);
        }
    };

    const handleOpen = (share: ShareCardProps) => {
        setSelectedShare(share);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleFavorite = (share: ShareCardProps) => {
        const isFavorite = favorites.some(favorite => favorite.symbol === share.symbol);
        if (isFavorite) {
            setFavorites(favorites.filter(favorite => favorite.symbol !== share.symbol));
        } else {
            setFavorites([...favorites, share]);
        }
    };

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleFavoriteFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShowFavoritesOnly(event.target.checked);
    };

    const handleResultsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setResultsPerPage(Number(event.target.value));
    };

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/');
    };

    const handleLogin = () => {
        navigate('/');
    };

    return (
        <Box sx={{ flexGrow: 1, padding: 2, marginTop: 60, height: 'calc(100vh - 70px)', overflowY: 'auto' }}>
            <IconButton
                onClick={handleDrawerToggle}
                sx={{
                    position: 'fixed',
                    top: 10,
                    left: 10,
                    zIndex: 1200,
                    color: 'primary.main',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    boxShadow: 3,
                    '&:hover': {
                        backgroundColor: 'primary.light',
                    },
                }}
            >
                <MenuIcon />
            </IconButton>

            <IconButton
                onClick={isLoggedIn ? handleLogout : handleLogin}
                sx={{
                    position: 'fixed',
                    top: 10,
                    right: 10,
                    zIndex: 1200,
                    color: 'primary.main',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    boxShadow: 3,
                    '&:hover': {
                        backgroundColor: 'primary.light',
                    },
                }}
            >
                {isLoggedIn ? <ExitToAppIcon /> : <PersonIcon />}
            </IconButton>

            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={handleDrawerToggle}
                sx={{
                    width: 250,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 250,
                        boxSizing: 'border-box',
                        padding: 2,
                    },
                }}
                variant="temporary"
            >
                <Typography variant="h6" sx={{ marginBottom: 2 }}>Filtros</Typography>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={showFavoritesOnly}
                            onChange={handleFavoriteFilterChange}
                            color="primary"
                        />
                    }
                    label="Mostrar apenas favoritos"
                />
                <TextField
                    label="Itens por página"
                    type="number"
                    value={resultsPerPage}
                    onChange={handleResultsPerPageChange}
                    fullWidth
                    margin="normal"
                />
                <Button onClick={fetchShares} variant="contained" color="primary" fullWidth>
                    Aplicar Filtros
                </Button>
            </Drawer>

            {!isLoggedIn ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography variant="h5" color="textSecondary">
                        Usuário não logado, logue para mostrar as ações.
                    </Typography>
                </Box>
            ) : (
                <Grid
                    container
                    spacing={2}
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 0,
                    }}
                >
                    {shares.map((share, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card
                                sx={{
                                    height: 280,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: 6,
                                    },
                                    position: 'relative'
                                }}
                                onClick={() => handleOpen(share)}
                            >
                                <img
                                    src={share.logourl}
                                    alt={share.longName}
                                    style={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: '50%',
                                        display: 'block',
                                        margin: '0 auto 16px auto',
                                    }}
                                />
                                <CardContent>
                                    <Typography variant="h6">{share.longName}</Typography>
                                    <Typography variant="body2">{share.symbol}</Typography>
                                    <IconButton onClick={() => handleFavorite(share)}
                                    sx={{
                                        position: 'absolute', 
                                        top: 3,
                                        right: 0
                                    }}>
                                        {favorites.some(favorite => favorite.symbol === share.symbol) ? (
                                            <StarIcon color="primary" />
                                        ) : (
                                            <StarBorderIcon />
                                        )}
                                    </IconButton>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Modal
                open={open}
                onClose={handleClose}
                closeAfterTransition
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Fade in={open}>
                    <Box
                        sx={{
                            width: 400,
                            bgcolor: 'background.paper',
                            borderRadius: 2,
                            boxShadow: 24,
                            p: 4,
                            position: 'relative',
                        }}
                    >
                        <IconButton
                            sx={{ position: 'absolute', top: 8, right: 8 }}
                            onClick={handleClose}
                        >
                            <CloseIcon />
                        </IconButton>
                        {selectedShare && (
                            <>
                                <img
                                    src={selectedShare.logourl}
                                    alt={selectedShare.longName}
                                    style={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: '50%',
                                        display: 'block',
                                        margin: '0 auto 16px auto',
                                    }}
                                />
                                <Typography
                                    id="modal-title"
                                    variant="h6"
                                    textAlign="center"
                                    gutterBottom
                                >
                                    {selectedShare.longName}
                                </Typography>
                                <Typography
                                    id="modal-description"
                                    variant="body1"
                                    textAlign="center"
                                >
                                    Símbolo: {selectedShare.symbol}
                                </Typography>
                                <Typography
                                    id="modal-price"
                                    variant="body1"
                                    textAlign="center"
                                    mt={1}
                                >
                                    Preço: ${selectedShare.regularMarketPrice}
                                </Typography>
                            </>
                        )}
                    </Box>
                </Fade>
            </Modal>
        </Box>
    );
};

export default PagedList;
