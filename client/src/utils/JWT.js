import { toast } from 'react-toastify';

const logout = (toast) => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    const resolveAfter3Sec = new Promise(resolve => setTimeout(resolve, 3000));
    toast.promise(
        resolveAfter3Sec,
        {
          pending: 'Logout in progress',
          success: 'Logout successful 🎉',
          error: 'Logout failed 😞',
        }
    )
    .then(() => {
        setTimeout(() => {
            window.location.href = '/';
        }
        , 500);
    })
}

export { logout };
