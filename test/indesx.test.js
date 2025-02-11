const { default: axios } = require("axios");

const sum = (a, b) => {
  return a + b;
};

BACKEND_URL = "http://localhost:3000";

describe("Authentication", () => {
  test("User able to signUp only once.", async () => {
    const username = "sam" + Math.random();
    const password = "1234";
    const response = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
      username,
      password,
      type: "admin",
    });
    expect(response.statusCode).toBe(200);
    const updatedResponse = await axios.post(
      `${BACKEND_URL}/api/v1/user/signup`,
      {
        username,
        password,
        type: "admin",
      }
    );
    expect(response.statusCode).toBe(400);
  });

  test("SignUp will fail if username is empty", async () => {
    const password = "1224";
    const response = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
      password,
    });
    expect(response.statusCode).toBe(400);
  });

  test("SignIn succeeds if the username and pasword is correct",async()=>{
    const username=`Sam${Math.random()}`;
    const password="1234";

  await axios.post(`${BACKEND_URL}/api/v1/user/signUp`,{
        username,
        password,
        type:'admin'
    })

    const response=await axios.post(`${BACKEND_URL}/api/v1/user/signin`,{
        username,
        password
    });

    expect(response.statusCode).toBe(200); 
    expect(response.body.token).toBeDefined();
  })

  test("signIn fail if the username and password is incorrect",async()=>{
    const username=`sam${Math.random()}`;
    const password="12234";

    await axios.post(`${BACKEND_URL}/api/v1/user/signup`,{
        username,
        password
    })

    const response=await axios.post(`${BACKEND_URL}/api/v1/user/signin`,{
        username:"Wrong username",
        password
    })
      
    expect(response.statusCode).toBe(403);

  })
});


describe("User Information endpoints",()=>{
    
})