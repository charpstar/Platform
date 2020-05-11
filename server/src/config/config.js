export const port = 8081; // port used by backend
export const domain = '46.101.115.253'; // domain used by backend
export const isSecure = false; // set to true if reverse proxy uses TLS certificate

// list of all productstates in order of priority for showing most critical state
export const statePriority = [
  'ProductReceived',
  'ProductDev',
  'ProductReview',
  'ProductRefine',
  'ClientFeedback',
  'ProductMissing',
  'ProductQAMissing',
  'ClientProductReceived',
  'Done',
];
