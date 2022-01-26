interface IIncident {
  title: string;
  description: string;
  value: string;
  ongId: string;
}

class Incident implements IIncident {
  constructor(
    title: string,
    description: string,
    value: string,
    ongId: string
  ) {
    this.title = title;
    this.description = description;
    this.value = value;
    this.ongId = ongId;
  }

  title: string;
  description: string;
  value: string;
  ongId: string;
}

export default Incident;
