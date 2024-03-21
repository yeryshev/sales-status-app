import { userActions, userReducer } from './model/slice/userSlice';
import { User, UserSchema } from './model/types/User';
import { getUserAuthData } from './model/selectors/getUserAuthData/getUserAuthData';
import { getUserMounted } from './model/selectors/getUserMounted/getUserMounted';

export {
    userReducer,
    userActions,
    type UserSchema,
    type User,
    getUserAuthData,
    getUserMounted,
};
