import DogProfile from "../features/dogs/DogProfile";
import UserProfile from "../features/user/UserProfile";
import "../styles/Profile.css";

export default function Profile() {
    return (
        <div className="profile-container">
            <section className="profile-section">
                <h2>Käyttäjätili</h2>
                <div className="avatar-wrapper">
                    <img src="/placeholder-user.png" alt="User Avatar" />
                </div>
                <UserProfile />
            </section>

            <section className="profile-section">
                <h2>Koiraprofiili</h2>
                <div className="avatar-wrapper">
                    <img src="/placeholder-dog.png" alt="Dog Avatar" />
                </div>
                <DogProfile />
            </section>
        </div>
    );
}
