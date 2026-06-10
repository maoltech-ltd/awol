import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { 
    categoryReducer, 
    commentReducer, 
    imageReducer, 
    postsReducer, 
    secondUserReducer, 
    userReducer, 
    postReducer, 
    bulkCategoryReducer,
    authorReducer,
    customerReducer,
    contractReducer,
    paymentReducer,
    companyReducer,
    productReducer,
    defaultReducer,
} from "./slice";


const rootReducer = combineReducers({
    user: userReducer,
    posts: postsReducer,
    comment: commentReducer,
    category: categoryReducer,
    image: imageReducer,
    secondUser: secondUserReducer,
    post: postReducer,
    bulkCategory: bulkCategoryReducer,
    author: authorReducer,
    customer: customerReducer,
    contract: contractReducer,
    payment: paymentReducer,
    company: companyReducer,
    product: productReducer,
    default: defaultReducer,
})

export default rootReducer
