export function validateUser({ name, email, address, role, password }) {
  const errors = [];
  if (!name || name.length < 6 || name.length > 60) errors.push('Name must be 6-60 chars');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Invalid email');
  if (address && address.length > 400) errors.push('Address max 400 chars');
  if (role && !['admin','user','owner'].includes(role)) errors.push('Invalid role');
  if (password) {
    if (password.length < 8 || password.length > 16) errors.push('Password must be 8-16 chars');
    if (!/[A-Z]/.test(password)) errors.push('Password must include one uppercase');
    if (!/[^A-Za-z0-9]/.test(password)) errors.push('Password must include one special char');
  }
  return errors;
}

export function validateStore({ name, email, address, owner_id }) {
  const errors = [];
  if (!name || name.length < 1 || name.length > 60) errors.push('Store name 1-60 chars');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Invalid store email');
  if (address && address.length > 400) errors.push('Address max 400 chars');
  if (owner_id !== null && owner_id !== undefined && Number.isNaN(Number(owner_id))) errors.push('owner_id must be number or null');
  return errors;
}

export function validateRating({ user_id, store_id, rating }) {
  const errors = [];
  if (!user_id || !store_id) errors.push('user_id and store_id are required');
  if (rating == null || rating < 1 || rating > 5) errors.push('rating must be 1-5');
  return errors;
}
