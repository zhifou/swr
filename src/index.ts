
/**
 * @file 缓存的中间件hook
 */
import { reactive, readonly, toRefs, watchEffect } from 'vue';
const cache: any = {};

const useSWR = (key: string, promise: Promise<any>, initialValue: any = null) => {
    const state = reactive({
        data: (cache[key] ? cache[key] : null) || (localStorage.getItem(`swr-${key}`)
            ? JSON.parse(localStorage.getItem(`swr-${key}`))
            : initialValue),
        isRevalidating: true,
        isError: false,
        error: null,
    });
    promise.then((response: any) => {
        cache[key] = response;
        state.data = response;
        state.isRevalidating = false;
    })
    .catch((err: Error) => {
        state.isRevalidating = false;
        state.isError = true;
        state.error = err.message;
    });
    watchEffect(() => {
        try {
            localStorage.setItem(`swr-${key}`, JSON.stringify(state.data));
        }
        catch(err) {
            console.log(err);
        };
    });
    return readonly(toRefs(state));
};

export default useSWR;