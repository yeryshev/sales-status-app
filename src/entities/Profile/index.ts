import { Profile, ProfileSchema } from './model/types/profile';
import { profileActions, profileReducer } from './model/slice/profileSlice';

export {
    type Profile,
    type ProfileSchema,
    profileActions,
    profileReducer
}