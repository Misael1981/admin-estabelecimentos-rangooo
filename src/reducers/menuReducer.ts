export type CategorySummary = {
  id: string
  name: string
  productsCount: number
}

type MenuState = {
  categories: CategorySummary[]
  selectedCategoryId: string | null
}

type MenuAction =
  | { type: "SELECT_CATEGORY"; payload: string }
  | { type: "REMOVE_CATEGORY"; payload: string }
  | { type: "SET_CATEGORIES"; payload: CategorySummary[] }

export function menuReducer(state: MenuState, action: MenuAction): MenuState {
  switch (action.type) {
    case "SET_CATEGORIES":
      return {
        ...state,
        categories: action.payload,
        selectedCategoryId: action.payload[0]?.id ?? null,
      }

    case "SELECT_CATEGORY":
      return {
        ...state,
        selectedCategoryId: action.payload,
      }

    case "REMOVE_CATEGORY": {
      const filtered = state.categories.filter((c) => c.id !== action.payload)

      return {
        categories: filtered,
        selectedCategoryId:
          state.selectedCategoryId === action.payload
            ? (filtered[0]?.id ?? null)
            : state.selectedCategoryId,
      }
    }

    default:
      return state
  }
}
