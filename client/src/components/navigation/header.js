import { useEffect } from 'react';
import { Link } from 'react-router-dom'
import SideDrawer from './sideNavigation';

import { useSelector, useDispatch } from 'react-redux';
import { clearNotifications } from '../../store/reducers/notifications'
import { showToast } from '../../utils/tools';

const Header = () => {
    const notifications = useSelector(state => state.notifications);
    const dispatch = useDispatch();

    useEffect(()=>{
        let { global } = notifications;
        if(notifications && global.error) {
            const msg = global.msg ? global.msg : 'Error';
            showToast('ERROR', msg)
            dispatch(clearNotifications())
        }
        if(notifications && global.success) {
            const msg = global.msg ? global.msg : 'Success';
            showToast('SUCCESS', msg)
            dispatch(clearNotifications())
        }
    },[notifications])

    return (
        <nav className='navbar fixed-top'>
            <Link to='/' className='navbar-brand d-flex align-items-center fredoka_ff'>
                ReactDemoProject
            </Link>
            <SideDrawer/>
        </nav>
    )
}

export default Header