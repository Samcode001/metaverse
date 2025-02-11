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

  test("SignIn succeeds if the username and pasword is correct", async () => {
    const username = `Sam${Math.random()}`;
    const password = "1234";

    await axios.post(`${BACKEND_URL}/api/v1/user/signUp`, {
      username,
      password,
      type: "admin",
    });

    const response = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, {
      username,
      password,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  test("signIn fail if the username and password is incorrect", async () => {
    const username = `sam${Math.random()}`;
    const password = "12234";

    await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
      username,
      password,
    });

    const response = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, {
      username: "Wrong username",
      password,
    });

    expect(response.statusCode).toBe(403);
  });
});

describe("User Information endpoints", () => {
  let token = "";
  let avatarId = "";

  beforeAll(async () => {
    const username = `Sam${Math.random()}`;
    const password = "1234";

    await axios.post(`${BACKEND_URL}/api/v1/user/signUp`, {
      username,
      password,
      type: "admin",
    });

    const response = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, {
      username,
      password,
    });

    token = response.data.token;

    const avatarResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/avatar`,
      {
        imageUrl: "",
        name: "Sam",
      }
    );

    avatarId = avatarResponse.data.avatarId;
  });

  test("User can't update their metadata with a wrong avatar id", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/user/metadata`,
      {
        avatarId: "123131133",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    expect(response.statusCode).toBe(400);
  });

  test("User can update their metadata with a right avatar id", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/user/metadata`,
      {
        avatarId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    expect(response.statusCode).toBe(200);
  });

  test("User can't update their metadata if the authHeader is not present", async () => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
      avatarId,
    });

    expect(response.statusCode).toBe(403);
  });
});

describe("User avatar information", async () => {
  let token = "";
  let avatarId = "";
  let userId;

  beforeAll(async () => {
    const username = `Sam${Math.random()}`;
    const password = "1234";

    const signupResponse = await axios.post(
      `${BACKEND_URL}/api/v1/user/signUp`,
      {
        username,
        password,
        type: "admin",
      }
    );

    userId = signupResponse.data.userId;

    const response = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, {
      username,
      password,
    });

    token = response.data.token;

    const avatarResponse = await axios.post(
      `${BACKEND_URL}/api/v1/admin/avatar`,
      {
        imageUrl: "",
        name: "Sam",
      }
    );

    avatarId = avatarResponse.data.avatarId;
  });

  test("Get back avatar information about user", async () => {
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`
    );
    expect(response.data.avatars.length).toBe(1);
    expect(response.data.avatars[0].userId).toBe(userId);
  });
  test("Availabel avatar lists the recently crated avatar", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/avatars`);
    expect(response.data.avatars.length).not.toBe(0);
    const currentAvatar = response.data.avatar.find(
      (elem) => elem.id === avatarId
    );
    expect(currentAvatar).toBeDefined();
  });
});

describe("Space Information", async () => {
  let mapId;
  let element1Id;
  let element2Id;
  let userId;
  let userToken;
  let adminId;
  let adminToken;

  beforeAll(async () => {
    const username = `Sam${Math.random()}`;
    const password = "1234";

    const signupResponse = await axios.post(
      `${BACKEND_URL}/api/v1/user/signUp`,
      {
        username,
        password,
        type: "admin",
      }
    );

    adminId = signupResponse.data.userId;

    const response = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, {
      username,
      password,
    });

    adminToken = response.data.token;

    const userSignupResponse = await axios.post(
      `${BACKEND_URL}/api/v1/user/signUp`,
      {
        username: username + "-user",
        password,
        type: "user",
      }
    );

    userId = userSignupResponse.data.userId;

    const userResponse = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, {
      username: username + "-user",
      password,
    });

    userToken = userResponse.data.token;

    const element1 = await axios.post(
      `${BACKEND_URL} /api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true, // weather or not the user can sit on top of this element (is it considered as a collission or not)
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );

    const element2 = await axios.post(
      `${BACKEND_URL} /api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true, // weather or not the user can sit on top of this element (is it considered as a collission or not)
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );

    element1Id = element1.id;
    element2Id = element2.id;

    const map = await axios.post(
      `${BACKEND_URL}/api/v1/admin/map`,
      {
        thumbnail: "https://thumbnail.com/a.png",
        dimensions: "100x200",
        name: "100 person interview room",
        defaultElements: [
          {
            elementId: element1Id,
            x: 20,
            y: 20,
          },
          {
            elementId: element1Id,
            x: 18,
            y: 20,
          },
          {
            elementId: element2Id,
            x: 19,
            y: 20,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );

    mapId = map.id;
  });

  test("User is able to create a spece", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
        mapId: mapId,
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    expect(response.data.spaceId).toBeDefined();
  });
  test("User is able to create a space without mapId (empty space)", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    expect(response.data.spaceId).toBeDefined();
  });
  test("User is able to create a space without mapId and dimensions", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    expect(response.statusCode).toBe(400);
  });

  test("User is not able to delete a space that doesn't exist", async () => {
    const response = await axios.delete(
      `${BACKEND_URL}/api/v1/space/randomidnotexist`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(response.statusCode).toBe(400);
  });
  test("User is  able to delete a space that exist", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    const deleteResponse = await axios.delete(
      `${BACKEND_URL}/api/v1/space/${response.data.spaceId}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(deleteResponse.statusCode).toBe(400);
  });

  test("User should not be able to delete a space created by another user", async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    const deleteResponse = await axios.delete(
      `${BACKEND_URL}/api/v1/space/${response.data.spaceId}`,
      {
        headers: {
          Authorization: `Berarer ${adminToken}`,
        },
      }
    );

    expect(deleteResponse.statusCode).toBe(400);
  });

  test("Admin has no spaces initially", async () => {
    const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`);
    expect(response.data.spaces.length).toBe(0);
  });
  test("Admin has no spaces initially", async () => {
    const spaceCreateResponse = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`);
    const filterSpace = response.data.spaces.find(
      (elem) => elem.id === spaceCreateResponse.data.spaceId
    );
    expect(response.data.spaces.length).toBe(1);
    expect(filterSpace).toBeDefined();
  });
});

describe("Arena endpoints", async () => {
  let mapId;
  let element1Id;
  let element2Id;
  let userId;
  let userToken;
  let adminId;
  let adminToken;
  let spaceId;

  beforeAll(async () => {
    const username = `Sam${Math.random()}`;
    const password = "1234";

    const signupResponse = await axios.post(
      `${BACKEND_URL}/api/v1/user/signUp`,
      {
        username,
        password,
        type: "admin",
      }
    );

    adminId = signupResponse.data.userId;

    const response = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, {
      username,
      password,
    });

    adminToken = response.data.token;

    const userSignupResponse = await axios.post(
      `${BACKEND_URL}/api/v1/user/signUp`,
      {
        username: username + "-user",
        password,
        type: "user",
      }
    );

    userId = userSignupResponse.data.userId;

    const userResponse = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, {
      username: username + "-user",
      password,
    });

    userToken = userResponse.data.token;

    const element1 = await axios.post(
      `${BACKEND_URL} /api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true, // weather or not the user can sit on top of this element (is it considered as a collission or not)
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );

    const element2 = await axios.post(
      `${BACKEND_URL} /api/v1/admin/element`,
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
        width: 1,
        height: 1,
        static: true, // weather or not the user can sit on top of this element (is it considered as a collission or not)
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );

    element1Id = element1.id;
    element2Id = element2.id;

    const map = await axios.post(
      `${BACKEND_URL}/api/v1/admin/map`,
      {
        thumbnail: "https://thumbnail.com/a.png",
        dimensions: "100x200",
        name: "100 person interview room",
        defaultElements: [
          {
            elementId: element1Id,
            x: 20,
            y: 20,
          },
          {
            elementId: element1Id,
            x: 18,
            y: 20,
          },
          {
            elementId: element2Id,
            x: 19,
            y: 20,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );

    mapId = map.id;

    const space = await axios.post(
      `${BACKEND_URL}/api/v1/space`,
      {
        name: "Test",
        dimensions: "100x200",
        mapId: "map1",
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    spaceId = space.spaceId;
  });

  test("Incorrect spaceId retures 400",async()=>{
    const response=await axios.post(`${BACKEND_URL}/api/v1/space/1321w`);
    expect(response.statusCode).toBe(400);
  });
  test("Correct spaceId retures all the elements",async()=>{
    const response=await axios.post(`${BACKEND_URL}/api/v1/space/${spaceId}`);
    expect(response.data.elemets.length).toBe(3);   // beacuse we create three elements above only 
    expect(response.data.dimensions).toBe("100x200")
  });
  test("Delete endpoint is able to delete an element ",async()=>{
    const response=await axios.post(`${BACKEND_URL}/api/v1/space/${spaceId}`);
    expect(response.data.elemets.length).toBe(3);   // beacuse we create three elements above only 
    expect(response.data.dimensions).toBe("100x200")
  });


});
