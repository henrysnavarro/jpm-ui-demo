import "./cardStyles.css";

export type CardProps = {
  name: string;
  email: string;
  phoneNumber: string;
  url?: string;
  image?: string;
};

const Card = ({ name, email, phoneNumber, url, image }: CardProps) => {
  const userInitials = name
    .split(" ")
    .reduce((acc, currVal) => acc + currVal[0], "")
    .slice(0, 2);

  // Add initials to Avatar
  return (
    <div className="card">
      <div className="avatar">{image ? <img src={image} /> : userInitials}</div>
      <div className="container">
        <h4>
          Name: <b>{name}</b>
        </h4>
        {email && <p>Email: {email}</p>}
        {url && (
          <p>
            URL:{" "}
            <a href={url} target="_blank">
              {url}
            </a>
          </p>
        )}

        {phoneNumber && <p>Phone#: {phoneNumber}</p>}

        {/* <button>See details</button> */}
      </div>
    </div>
  );
};

export default Card;
