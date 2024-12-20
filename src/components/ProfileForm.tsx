/* eslint-disable @next/next/no-img-element */

'use client';

import React, { useState } from 'react';
import { Form, Button, Col, Container, Card, Row } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import Multiselect from 'multiselect-react-dropdown';
import { IProfile, ProfileSchema } from '@/lib/validationSchemas';
import { Interest, Profile, Project } from '@prisma/client';
import { createProfile, updateProfile } from '@/lib/dbActions';

const ProfileForm = ({
  profile,
  interests,
  projects,
  profileInterests,
  profileProjects,
  isNewProfile,
}: {
  profile: Profile;
  interests: Interest[];
  projects: Project[];
  profileInterests: Interest[];
  profileProjects: Project[];
  isNewProfile: boolean;
}) => {
  const formPadding = 'py-1';
  const [pictureUrl, setPictureUrl] = useState(profile.picture || '');
  const interestNames = interests.map((interest) => interest.name);
  const profileInterestNames = profileInterests.map(
    (interest) => interest.name,
  );
  const projectNames = projects.map((project) => project.name);
  const profileProjectNames = profileProjects.map((project) => project.name);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ProfileSchema),
  });

  const onSubmit = async (data: IProfile) => {
    try {
      const result = isNewProfile
        ? await createProfile(data)
        : await updateProfile(data);

      if (result) {
        await swal(
          'Success!',
          `Profile ${isNewProfile ? 'created' : 'updated'} successfully!`,
          'success',
        );
        // No need to reload the page, Next.js will revalidate
      } else {
        swal(
          'Error!',
          `Failed to ${isNewProfile ? 'create' : 'update'} profile!`,
          'error',
        );
      }
    } catch (error) {
      console.error('Error with profile:', error);
      swal(
        'Error!',
        `Failed to ${isNewProfile ? 'create' : 'update'} profile!`,
        'error',
      );
    }
  };

  return (
    <Container>
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row className={formPadding}>
              <Col xs={4}>
                <Form.Group controlId="firstName">
                  <Form.Label>First Name*</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('firstName')}
                    defaultValue={profile.firstName || ''}
                  />
                  <Form.Text className="text-danger">
                    {errors.firstName?.message}
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col xs={4}>
                <Form.Group controlId="lastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('lastName')}
                    defaultValue={profile.lastName!}
                  />
                  <Form.Text className="text-danger">
                    {errors.lastName?.message}
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col xs={4}>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('email')}
                    defaultValue={profile.email!}
                    readOnly
                  />
                  <Form.Text className="text-danger">
                    {errors.email?.message}
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
            <Row className={formPadding}>
              <Col>
                <Form.Group controlId="bio">
                  <Form.Label>Biographical statement</Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder="Your short biography."
                    {...register('bio')}
                    defaultValue={profile.bio!}
                  />
                  <Form.Text muted>(optional)</Form.Text>
                  <Form.Text className="text-danger">
                    {errors.bio?.message}
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
            <Row className={formPadding}>
              <Col xs={6}>
                <Form.Group controlId="interests">
                  <Form.Label>Interests</Form.Label>
                  <Controller
                    control={control}
                    name="interests"
                    render={({ field: { onChange } }) => (
                      <Multiselect
                        options={interestNames}
                        isObject={false}
                        // showCheckbox
                        hidePlaceholder
                        closeOnSelect={false}
                        onSelect={onChange}
                        onRemove={onChange}
                        selectedValues={profileInterestNames}
                      />
                    )}
                  />
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group controlId="projects">
                  <Form.Label>Projects</Form.Label>
                  <Controller
                    control={control}
                    name="projects"
                    render={({ field: { onChange } }) => (
                      <Multiselect
                        options={projectNames}
                        isObject={false}
                        // showCheckbox
                        hidePlaceholder
                        closeOnSelect={false}
                        onSelect={onChange}
                        onRemove={onChange}
                        selectedValues={profileProjectNames}
                      />
                    )}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className={formPadding}>
              <Col>
                <Form.Group controlId="picture">
                  <Form.Label>Profile Picture URL</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter image URL"
                    {...register('picture')}
                    defaultValue={pictureUrl}
                    onChange={(e) => setPictureUrl(e.target.value)}
                  />
                  <Form.Text className="text-danger">
                    {errors.picture?.message}
                  </Form.Text>
                </Form.Group>
                {pictureUrl && (
                  <div className="mt-3">
                    <p>Picture Preview:</p>
                    <img
                      src={pictureUrl}
                      alt="Profile preview"
                      style={{ maxWidth: '200px', borderRadius: '8px' }}
                    />
                  </div>
                )}
              </Col>
            </Row>
            <Row className={formPadding}>
              <Col>
                <Button variant="primary" type="submit">
                  {isNewProfile ? 'Create Profile' : 'Update Profile'}
                </Button>
              </Col>
              {!isNewProfile && (
                <Col>
                  <Button
                    variant="warning"
                    type="reset"
                    onClick={() => reset()}
                  >
                    Reset
                  </Button>
                </Col>
              )}
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProfileForm;
