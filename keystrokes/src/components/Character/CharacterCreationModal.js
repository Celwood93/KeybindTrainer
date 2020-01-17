import React, {useState} from 'react';
import {Modal, Button, TextField, FormControl, InputLabel, Select, MenuItem, Grid} from '@material-ui/core';
import { characterDetails } from '../../config/constants';
import styleGuide from '../../stylesheets/style';

function CharacterCreationModal({handleSubmit, isOpen, setIsOpen}) {
    const [characterName, setCharacterName] = useState("");
    const [characterClass, setCharacterClass] = useState("");
    const [characterRace, setCharacterRace] = useState("");
    const [characterSpec, setCharacterSpec] = useState("");
	const classes = styleGuide();

    const handleChangeName = (event) => {
		setCharacterName(event.target.value);
    }

    const handleChangeClass = (event) => {
		setCharacterClass(event.target.value);
    }

    const handleChangeRace = (event) => {
		setCharacterRace(event.target.value);
    }

    const handleChangeSpec = (event) => {
		setCharacterSpec(event.target.value);
    }

    return (
        <Modal
            open={isOpen}
            onClose={setIsOpen(true)}
            className={classes.modal}
        >
            <div className={classes.paper}>
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                    <TextField
                        label="Character Name"
                        value={characterName}
                        onChange={handleChangeName}
                        variant="outlined"
                        className={classes.button}
                    />
                </Grid>
                <Grid item>
                <FormControl className={classes.button}>
                    <InputLabel>Race</InputLabel>
                    <Select
                        value={characterRace}
                        onChange={handleChangeRace}
                    >
                        {
                            characterDetails.race.map(race => (
                                <MenuItem key={race} value={race}>
                                    {race}
                                </MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
                </Grid>
                <Grid item>
                <FormControl className={classes.button}>
                    <InputLabel>Class</InputLabel>
                    <Select
                        value={characterClass}
                        onChange={handleChangeClass}
                    >
                        {
                            Object.keys(characterDetails.class).map(heroClass => (
                                <MenuItem key={heroClass} value={heroClass}>
                                    {heroClass}
                                </MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
                </Grid>
                <Grid item>
                <FormControl disabled={characterClass === ""} className={classes.button}>
                    <InputLabel>Spec</InputLabel>
                    <Select
                        value={characterSpec}
                        onChange={handleChangeSpec}
                    >
                        {
                            characterDetails.class[characterClass].map(spec => (
                                <MenuItem key={spec} value={spec}>
                                    {spec}
                                </MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
                </Grid>
                </Grid>
                <Grid container justify="flex-end">
                <Grid item style={{paddingTop: '5rem'}}>
                    <Button size="large" onClick={()=> setIsOpen(false)}>Cancel</Button>
                </Grid>
                <Grid item style={{paddingTop: '5rem'}}>
                    <Button disabled={characterName === "" || characterSpec === "" || characterRace === "" || characterName === ""} size="large" onClick={
                        () => {
                            handleSubmit({characterClass, name: characterName, spec: characterSpec, race: characterRace});
                            setIsOpen(false);
                        }
                    }>
                    Submit
                    </Button>
                </Grid>
                </Grid>
            </div>
        </Modal>
    )
}

export default CharacterCreationModal;
