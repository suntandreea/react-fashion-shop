import {createContext, useReducer} from 'react';
import {DUMMY_PRODUCTS} from '../dummy-products.js';

export const CartContext = createContext({
  items: [],
  addItemToCart: () => {
  },
  updateItemQty: () => {
  }
});

function cartReducer(state, action) {
  if (action.type === 'ADD_ITEM') {
    const updatedItems = [...state.items];

    const existingCartItemIndex = updatedItems.findIndex(
      (cartItem) => cartItem.id === action.payload
    );
    const existingCartItem = updatedItems[existingCartItemIndex];

    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity + 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      const product = DUMMY_PRODUCTS.find((product) => product.id === action.payload);
      updatedItems.push({
        id: action.payload,
        name: product.title,
        price: product.price,
        quantity: 1,
      });
    }

    return {
      ...state, // not needed here because we have only one value
      items: updatedItems,
    };
  }

  if (action.type === 'UPDATE_ITEM') {
    const updatedItems = [...state.items];
    const updatedItemIndex = updatedItems.findIndex(
      (item) => item.id === action.payload.productId
    );

    const updatedItem = {
      ...updatedItems[updatedItemIndex],
    };

    updatedItem.quantity += action.payload.amount;

    if (updatedItem.quantity <= 0) {
      updatedItems.splice(updatedItemIndex, 1);
    } else {
      updatedItems[updatedItemIndex] = updatedItem;
    }

    return {
      ...state,
      items: updatedItems,
    };
  }

  return state;
}

export default function CartContextProvider({children}) {

  const [shoppingCart, dispatch] = useReducer(cartReducer, {
    items: [],
  });

  function handleAddItemToCart(id) {
    dispatch({
      type: 'ADD_ITEM',
      payload: id
    });
  }

  function handleUpdateCartItemQuantity(productId, amount) {
    dispatch({
      type: 'UPDATE_ITEM',
      payload: {
        productId,
        amount
      }
    });
  }

  const ctxValue = {
    items: shoppingCart.items,
    addItemToCart: handleAddItemToCart,
    updateItemQty: handleUpdateCartItemQuantity
  };

  return <CartContext.Provider value={ctxValue}>
    {children}
  </CartContext.Provider>
}
