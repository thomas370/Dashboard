//logout user
const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    window.location.href = '/';
}

window.addEventListener('beforeunload', logout);

export { logout };