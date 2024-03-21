import { profileActions, profileReducer } from './model/slice/profileSlice';
import { Profile, ProfileSchema } from './model/types/profile';

export { ProfilePageAsync as ProfilePage } from './ui/ProfilePage.async';

export {
    profileActions,
    profileReducer,
    type Profile,
    type ProfileSchema,
};