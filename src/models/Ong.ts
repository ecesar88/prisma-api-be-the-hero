interface IOng {
  name: string;
  email: string;
  whatsapp: string;
  city: string;
  uf: string;
  password: string;
}

class Ong implements IOng {
  constructor(
    name: string,
    email: string,
    whatsapp: string,
    city: string,
    uf: string,
    password: string
  ) {
    this.name = name;
    this.email = email;
    this.whatsapp = whatsapp;
    this.city = city;
    this.uf = uf;
    this.password = password;
  }

  name: string;
  email: string;
  whatsapp: string;
  city: string;
  uf: string;
  password: string;
}

export default Ong;
