export default async () => {
  /**
   * The code to be executed should be placed within a default function that is
   * exported by the global script. Ensure all of the code in the global script
   * is wrapped in the function() that is exported.
   */
  // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImY2ZjA1NTAzLTcwN2ItNDI4Ni1hNWRkLWRmMzcwNjYxZTYxZiIsInVzZXJuYW1lIjoic2Fua2FyMyIsImlhdCI6MTY4OTE3MzEwNX0.V2wFNLmOUa8b881etEKlB93aKMfd-O6DHUVe6yNbh4A'
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjI4ZmM3Yjk3LTZlMTgtNGM2Mi1iNzc1LTQxYTc1NWIzYTRkMSIsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE2ODkxODY4MjN9.l4MKg70CdG79TE3BPlxOmX4X81TMbl5BK0Wlqsh51L0'
  localStorage.setItem('token', token)
};
