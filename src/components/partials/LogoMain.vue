<template>
    <div id="logo">
        > cmdpedia
    </div>
</template>

<style scoped>
#logo {
    color: var(--color-heading);
    font-size: 2em;
    transition: color 0.2s;
    margin-left: 10px;
}

@media (max-width: 825px) {
    #logo {
        font-size: 1.7em;
    }
}

@media (max-width: 625px) {
    #logo {
        font-size: 1.5em;
    }
}


@media (max-width: 425px) {
    #logo {
        font-size: 1.2em;
    }
}

#logo:hover {
    color: var(--color-hover);
}
</style>