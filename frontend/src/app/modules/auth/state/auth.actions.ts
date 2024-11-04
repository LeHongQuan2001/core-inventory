import { User } from '../../../models/user.model';
import { createAction, props } from '@ngrx/store';
export const LOGIN_START = '[auth page] login start';
export const LOGIN_SUCCESS = '[auth page] login Success';
export const LOGIN_FAIL = '[auth page] login Fail';

export const SIGNUP_START = '[auth page] signup start';
export const SIGNUP_SUCCESS = '[auth page] signup success';
export const AUTO_LOGIN_ACTION = '[auth page] auto login';
export const LOGOUT_ACTION = '[auth page] logout';

export const OTP_VERIFY_START = '[auth page] otp verify start';
export const OTP_VERIFY_SUCCESS = '[auth page] otp verify Success';
export const OTP_VERIFY_FAIL = '[auth page] otp verify Fail';

export const loginStart = createAction(
    LOGIN_START,
    props<{ username: string; password: string }>()
);
export const loginSuccess = createAction(
    LOGIN_SUCCESS,
    props<{ user: User; redirect: boolean }>()
);
export const loginFail = createAction(
    LOGIN_FAIL,
    props<{ reason: string }>()
);

export const otpVerifyStart = createAction(
    OTP_VERIFY_START,
    props<{ code: string; }>()
);
export const otpVerifySuccess = createAction(
    OTP_VERIFY_SUCCESS,
    props<{ user: User; redirect: boolean }>()
);
export const otpVerifyFail = createAction(
    OTP_VERIFY_FAIL,
    props<{ reason: string }>()
);

export const signupStart = createAction(
    SIGNUP_START,
    props<{ username: string; password: string }>()
);

export const signupSuccess = createAction(
    SIGNUP_SUCCESS,
    props<{ user: User; redirect: boolean }>()
);

export const autoLogin = createAction(AUTO_LOGIN_ACTION);
export const autoLogout = createAction(LOGOUT_ACTION);
export const dummyAction = createAction('[dummy action]');
