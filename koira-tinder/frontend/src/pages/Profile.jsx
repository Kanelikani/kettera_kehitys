import { useState } from "react";
import DogProfile from "../features/dogs/DogProfile";
import UserProfile from "../features/user/UserProfile";
import "../styles/Profile.css";

export default function Profile() {
    const [userPreviewImage, setUserPreviewImage] = useState("");
    const [dogPreviewImage, setDogPreviewImage] = useState("");

    const handleUserImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUserPreviewImage(URL.createObjectURL(file));
    };

    const handleDogImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setDogPreviewImage(URL.createObjectURL(file));
    };

    return (
        <div className="profile-container">
            <section className="profile-section">
                <h2>Käyttäjätili</h2>

                <div className="avatar-wrapper">
                    <div className="avatar">
                        {userPreviewImage ? (
                            <img src={userPreviewImage} alt="User avatar preview" />
                        ) : (
                            "User Avatar"
                        )}
                    </div>

                    <label className="avatar-upload">
                        +
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleUserImageChange}
                            hidden
                        />
                    </label>
                </div>

                <UserProfile />
            </section>

            <section className="profile-section">
                <h2>Koiraprofiili</h2>

                <div className="avatar-wrapper">
                    <div className="avatar">
                        {dogPreviewImage ? (
                            <img src={dogPreviewImage} alt="Dog avatar preview" />
                        ) : (
                            "Dog Avatar"
                        )}
                    </div>

                    <label className="avatar-upload">
                        +
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleDogImageChange}
                            hidden
                        />
                    </label>
                </div>

                <DogProfile />
            </section>
        </div>
    );
}