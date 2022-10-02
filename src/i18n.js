import { addMessages, init, getLocaleFromNavigator } from 'svelte-i18n';

import en from './locale/en.json';
import zhCN from './locale/zh-CN.json';

addMessages('en-US', en);
addMessages('zh-CN', zhCN);

init({
    fallbackLocale: 'en-US',
    initialLocale: getLocaleFromNavigator(),
});