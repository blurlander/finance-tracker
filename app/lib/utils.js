export const curencyFormat = (amount) => {
    const formatter = Intl.NumberFormat("en-US", {
        currency: "USD",
        style: "currency",
    })
  return formatter.format(amount);
}
