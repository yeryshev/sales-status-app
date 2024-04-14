import { userActions, userReducer } from './model/slice/userSlice';
import { User, UserSchema } from './model/types/User';
import { getUserData } from './model/selectors/userSelectors';
import { getUserAuthData } from './model/selectors/getUserAuthData/getUserAuthData';
import { getUserMounted } from './model/selectors/getUserMounted/getUserMounted';

export { userReducer, userActions, type UserSchema, type User, getUserData, getUserAuthData, getUserMounted };

export { checkUser } from './model/actions/userActions';
