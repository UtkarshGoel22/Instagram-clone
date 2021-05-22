export const initialState = null;

export const reducer = (state, action) => {
    // eslint-disable-next-line
    if(action.type == "USER") {
        return action.payload;
    }
    // eslint-disable-next-line
    if(action.type == "CLEAR") {
        return null;
    }
    // eslint-disable-next-line
    if(action.type == "UPDATE") {
        return {
            ...state,
            followers: action.payload.followers,
            following: action.payload.following
        }
    }
    // eslint-disable-next-line
    if(action.type == "UPDATEPIC") {
        return {
            ...state,
            pic: action.payload
        }
    }
    return state;
}