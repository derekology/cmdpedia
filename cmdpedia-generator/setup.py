from setuptools import setup, find_packages

setup(
    name='cmdpedia_generator',
    version='0.1.0',
    packages=find_packages(),
    install_requires=[],
    entry_points={
        'console_scripts': [
            'cmdpedia_generator = cmdpedia_generator.__main__:main',
        ],
    },
    include_package_data=True,
    description='A tool for generating command documentation from Click CLI modules.',
    author='Derek Woo',
    author_email='me@derekw.co',
    url='https://github.com/derekology/cmdpedia-generator',
    classifiers=[
        'Programming Language :: Python :: 3',
        'Operating System :: OS Independent',
    ],
    python_requires='>=3.6',
)
