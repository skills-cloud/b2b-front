import React from 'react';
import { Link } from 'react-router-dom';

import useClassnames from 'hook/use-classnames';
import Avatar from 'component/avatar';
import IconPlus from 'component/icons/plus';

import style from './index.module.pcss';

const DATA = [{
    name    : 'Федоров Алексей Иванович',
    position: 'Senior Front-end Developer',
    photo   : 'https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairTheCaesarSidePart&accessoriesType=Wayfarers&hairColor=Blonde&facialHairType=MoustacheFancy&facialHairColor=Blonde&clotheType=CollarSweater&clotheColor=Heather&eyeType=Default&eyebrowType=UpDown&mouthType=Smile&skinColor=Pale'
}, {
    name    : 'Алексеев Антон Вячеславович',
    position: 'Senior Front-end Developer',
    photo   : 'https://avataaars.io/?avatarStyle=Transparent&topType=Hat&accessoriesType=Prescription02&hairColor=BlondeGolden&facialHairType=BeardLight&facialHairColor=BlondeGolden&clotheType=Overall&clotheColor=PastelRed&eyeType=Surprised&eyebrowType=UpDown&mouthType=ScreamOpen&skinColor=Yellow'
}, {
    name    : 'Иванов Алексей Федорович',
    position: 'Senior Front-end Developer',
    photo   : 'https://avataaars.io/?avatarStyle=Transparent&topType=LongHairFrida&accessoriesType=Blank&facialHairType=BeardMedium&facialHairColor=Platinum&clotheType=BlazerSweater&clotheColor=Blue02&eyeType=Cry&eyebrowType=SadConcerned&mouthType=Grimace&skinColor=Pale'
}, {
    name    : 'Сервеев Антон Иванович',
    position: 'Senior Front-end Developer',
    photo   : 'https://avataaars.io/?avatarStyle=Transparent&topType=LongHairFrida&accessoriesType=Prescription01&facialHairType=Blank&facialHairColor=Blonde&clotheType=BlazerShirt&eyeType=Hearts&eyebrowType=SadConcerned&mouthType=Smile&skinColor=DarkBrown'
}, {
    name    : 'Макаров Алексей Владимирович',
    position: 'Senior Front-end Developer',
    photo   : 'https://avataaars.io/?avatarStyle=Transparent&topType=LongHairBigHair&accessoriesType=Prescription01&hairColor=BrownDark&facialHairType=BeardLight&facialHairColor=Blonde&clotheType=BlazerShirt&eyeType=Cry&eyebrowType=RaisedExcitedNatural&mouthType=Tongue&skinColor=Tanned'
}, {
    name    : 'Солодов Олег Вячеславович',
    position: 'Senior Front-end Developer',
    photo   : 'https://avataaars.io/?avatarStyle=Transparent&topType=Turban&accessoriesType=Kurt&hatColor=Blue03&hairColor=Brown&facialHairType=Blank&facialHairColor=Brown&clotheType=CollarSweater&clotheColor=Blue02&eyeType=Dizzy&eyebrowType=UpDown&mouthType=Default&skinColor=Light'
}];

export const Specialists = () => {
    const cn = useClassnames(style);

    return (
        <div className={cn('specialists')}>
            <main className={cn('specialists__main')}>
                <h1 className={cn('specialists__main-header')}>Специалисты</h1>
                <div className={cn('specialists__users')}>
                    {DATA.map((user, index) => (
                        <div key={index} className={cn('specialists__user')}>
                            <Avatar src={user.photo} />
                            <Link to={`/user/${index}`}>{user.name}</Link>
                            <span>{user.position}</span>
                        </div>
                    ))}
                </div>
                <Link
                    to="/specialists/create"
                    className={cn('specialists__main-button')}
                >
                    <IconPlus />
                </Link>
            </main>
            <aside className={cn('specialists__sidebar')}>

            </aside>
        </div>
    );
};

export default Specialists;
