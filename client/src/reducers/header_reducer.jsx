import { HeaderComponent } from '../components/Header';

export default function headerReducer(state = Map(), action) {
  switch (action.type) {
  case 'HANDLE_NEW_TOURN':
    return handleNewTourn(state, action.entries);
  case 'HANDLE_ALL_TOURNS':
    return handleAllTourns(state, action.entries);
  case 'HANDLE_ALERTS':
    return handleAlerts(state, action.entries);
  case 'HANDLE_LOGIN':
    return handleLogin(state, action.entries);
  }
  return state;
}

